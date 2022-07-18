using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Target : MonoBehaviour
{
    private Rigidbody rb;
    void Start()
    {
        rb = gameObject.GetComponent<Rigidbody>();

        // Spawn
        transform.position = new Vector3(Random.Range(-4f, 4f), -2);

        rb.AddForce(Vector3.up * Random.Range(12, 16), ForceMode.Impulse);
        rb.AddTorque(Random.Range(-10, 10), Random.Range(-10, 10), Random.Range(-10, 10));
    }

    private void OnMouseDown()
    {
        Destroy(gameObject);
    }

    private void OnTriggerEnter(Collider other)
    { // must be the only one trigger there (the Sensor)
        Destroy(gameObject);
    }
}
