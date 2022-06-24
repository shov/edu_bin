using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    private float horizontalInput;
    private float speed = 15f;
    private float xRange = 15f;

    public GameObject bonePrefab;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if(transform.position.x < -xRange || transform.position.x > xRange)
        {
            transform.position = new Vector3(xRange * (transform.position.x < 0 ? -1 : 1), transform.position.y, transform.position.z);
        }

        horizontalInput = Input.GetAxis("Horizontal");
        transform.Translate(Vector3.right * Time.deltaTime * horizontalInput * speed);

        if(Input.GetKeyDown(KeyCode.Space))
        {
            Instantiate(
                bonePrefab, 
                new Vector3(transform.position.x, 1, transform.position.z), 
                bonePrefab.transform.rotation
               );
        }
    }
}
