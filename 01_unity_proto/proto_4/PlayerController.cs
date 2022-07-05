using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float speed = .5f;
    public bool hasPopwerUp = false;
    private Rigidbody rb;
    private GameObject focalPoint;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        focalPoint = GameObject.Find("FocalPoint");
    }

    // Update is called once per frame
    void Update()
    {
        float verticalInput = Input.GetAxis("Vertical");
        rb.AddForce(focalPoint.transform.forward * speed * verticalInput);
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("PowerUp"))
        {
            hasPopwerUp = true;
            Destroy(other.gameObject);
        }
    }
}