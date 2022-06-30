using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RepeatBackground : MonoBehaviour
{
    private Vector3 startPos;
    private float resetX;

    void Start()
    {
        startPos = transform.position;
        resetX = startPos.x - (GetComponent<Collider>().bounds.size.x / 2);
    }

    void Update()
    {
        if(transform.position.x < resetX)
        {
            transform.position = startPos;
        }
    }
}
