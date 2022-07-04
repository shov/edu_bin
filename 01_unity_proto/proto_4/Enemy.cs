using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy : MonoBehaviour
{
    public float speed = .3f;
    private Rigidbody rb;
    private GameObject player;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        player = GameObject.Find("Player");
    }

    
    void Update()
    {
        Vector3 a = (player.transform.position - transform.position);
        Vector3 b = a.normalized;

        Debug.Log(a.x + " "  + a.y + " " + a.z);
        Debug.Log(b.x + " " + b.y + " " + b.z);
        rb.AddForce((player.transform.position - transform.position).normalized * speed);
    }
}
