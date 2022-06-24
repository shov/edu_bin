using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DestroyOutOfBound : MonoBehaviour
{
    public float topBound = 30f;
    public float lowerBound = -10f;

    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if(transform.position.z >= topBound || transform.position.z <= lowerBound)
        {
            Destroy(gameObject);

            if(transform.position.z <= lowerBound)
            {
                Debug.Log("Game over?");
            }
        }
    }
}
