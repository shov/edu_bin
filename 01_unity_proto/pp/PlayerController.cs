using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 10f;
    public Rigidbody rb;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }

    void Update()
    {
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");

        rb.AddForce(Vector3.forward * moveSpeed * verticalInput);
        rb.AddForce(Vector3.right * moveSpeed * horizontalInput);
        //transform.Translate(Vector3.forward * verticalInput * Time.deltaTime + Vector3.right * horizontalInput * Time.deltaTime, Space.World);

        if (System.Math.Abs(horizontalInput) + System.Math.Abs(verticalInput) > 0)
        {
            Vector3 moveDirection = new Vector3(horizontalInput * moveSpeed, 0f, verticalInput * moveSpeed) + transform.position;
            transform.LookAt(moveDirection);
        }

        
    }
}
