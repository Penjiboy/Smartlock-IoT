package com.penjiboy.g14smartlock;

import android.app.PendingIntent;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.TextView;
import android.widget.ToggleButton;


import com.github.nkzawa.socketio.client.*; // java socket io client
import com.github.nkzawa.socketio.client.Socket;
import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.engineio.client.*; // java engine io client
import com.github.nkzawa.engineio.client.transports.*;


import org.json.JSONObject;

import java.net.MalformedURLException;
import java.net.URISyntaxException;


public class ControlActivity extends AppCompatActivity {
    TextView userText;
    private static final String ip = "http://38.88.74.79:80";
    ToggleButton lock;
    Socket socket;
    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_control);
        Intent intent = getIntent();
        lock = (ToggleButton)findViewById(R.id.doorStatus);
        userText = findViewById(R.id.UserTitle);
        userText.setText("Welcome: "+intent.getStringExtra("name"));
        try {
            socket = IO.socket(ip);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        socket.connect();  // initiate connection to socket server

//        socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
//            @Override
//            public void call(Object... args) {
//
//            }
//        }).on("lockChanged", new Emitter.Listener() {
//            @Override
//            public void call(Object... args) {
//                Log.w("args",args[0].toString());
//                int input = (Integer) args[0];
//                lock.setChecked(input==1);
//            }
//        });
        lock.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if(b){
                    socket.emit("lockChanged",1);
                }
                else
                    socket.emit("lockChanged",0);
            }
        });

    }

//    private void sendNoc(){
//        Intent intent = new Intent(this, ControlActivity.class);
//        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
//        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, 0);
//
//        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this,"basic")
//                .setSmallIcon(R.drawable.logo)
//                .setContentTitle("SmartLock Request")
//                .setContentText("Someone is requesting to open smart lock")
//                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
//                // Set the intent that will fire when the user taps the notification
//                .setContentIntent(pendingIntent)
//                .setAutoCancel(true);
//        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
//
//// notificationId is a unique int for each notification that you must define
//        notificationManager.notify(1, mBuilder.build());
//    }
}
