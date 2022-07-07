using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RemoveFallen : MonoBehaviour
{
    public float bottom = -20f;
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if(transform.position.y < bottom)
        {
            Destroy(gameObject);
        }
    }
}
