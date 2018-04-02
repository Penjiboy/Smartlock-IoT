package com.penjiboy.g14smartlock;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.TextView;
import android.widget.ToggleButton;


import org.json.JSONObject;
import io.socket.client.Socket;
import io.socket.client.IO;
import io.socket.emitter.Emitter;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;

import io.socket.client.*;


import static android.provider.ContactsContract.CommonDataKinds.Website.URL;


public class ControlActivity extends AppCompatActivity {
    TextView userText;
    private static final String ip = "http://38.88.74.79:80";
    ToggleButton lock;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_control);
        Intent intent = getIntent();
        lock = (ToggleButton)findViewById(R.id.doorStatus);
        userText = findViewById(R.id.UserTitle);
        userText.setText("Welcome: "+intent.getStringExtra("name"));

        try{
            socket mSocket;
            mSocket = IO.socket("http://38.88.74.79:80");
            mSocket.connect();
            mSocket.on("lockChanged",data -> {
                if(data[0]==1){
                    lock.setChecked(true);
                }
                else if(data[0]==0)
                    lock.setChecked(false);
            });

            lock.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                    if(b){
                        mSocket.emit("lockChanged",1);
                    }
                    else
                        mSocket.emit("lockChanged",0);
                }
            });

        }catch (MalformedURLException ex){
            ex.printStackTrace();
        }
    }
}
