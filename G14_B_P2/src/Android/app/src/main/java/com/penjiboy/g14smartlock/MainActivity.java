package com.penjiboy.g14smartlock;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.ToggleButton;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.android.volley.toolbox.StringRequest;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {

    ToggleButton toggleButton;
    TextView textView;
    String output;
    JSONObject out;

    EditText _userText;
    EditText _passwordText;
    Button _loginButton;
    TextView _signupLink;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        _userText = (EditText)findViewById(R.id.input_user);
        _passwordText = (EditText)findViewById(R.id.input_password);
        _loginButton = (Button)findViewById(R.id.btn_login);
// ...

// Instantiate the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(this);
        String url = "http://38.88.74.79:9014/users";

        // Request a string response from the provided URL.
        JsonObjectRequest jsObjRequest = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                out=response;
                Log.w("out:",out.toString());
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.w("response fail","no input");
            }
        });

// Add the request to the RequestQueue.
        queue.add(jsObjRequest);

        _loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Login();
            }
        });


    }

    private void Login(){

        try {
            JSONArray logininfo = out.getJSONArray("data");
            for (int i = 0; i<logininfo.length();++i){
                JSONObject user = logininfo.getJSONObject(i);
                Log.w("user:",user.get("Member").toString());
                Log.w("looking for",_userText.getText().toString());

                if(user.get("Member").toString().equals(_userText.getText().toString())){
                    Log.w("yes","worked");
                    if(user.get("Password").toString().equals(_passwordText.getText().toString())){

                        Intent controlIntent = new Intent(MainActivity.this,ControlActivity.class);
                        controlIntent.putExtra("name",_userText.getText().toString().toUpperCase());
                        MainActivity.this.startActivity(controlIntent);
                        break;
                    }
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

//    /**
//     * Handle toggle button interactions. Send appropriate http requests based
//     * on the state of the lock
//     */
//    private void handleToggleButton() {
//        final String url = "http://38.88.74.79/androidInput";
//    }
//
//    @Override
//    public boolean onCreateOptionsMenu(Menu menu) {
//        // Inflate the menu; this adds items to the action bar if it is present.
//        getMenuInflater().inflate(R.menu.menu_main, menu);
//        return true;
//    }
//
//    @Override
//    public boolean onOptionsItemSelected(MenuItem item) {
//        // Handle action bar item clicks here. The action bar will
//        // automatically handle clicks on the Home/Up button, so long
//        // as you specify a parent activity in AndroidManifest.xml.
//        int id = item.getItemId();
//
//        //noinspection SimplifiableIfStatement
//        if (id == R.id.action_settings) {
//            return true;
//        }
//
//        return super.onOptionsItemSelected(item);
//    }
}
