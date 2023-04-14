using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Striker : MonoBehaviour
{
    public float rotateSpeed = -100f;

    public GameObject projectilePrefab;

    public bool isFireLocked = false;

    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        transform.RotateAround(Vector3.zero, Vector3.forward, rotateSpeed * Time.deltaTime);

        if (Input.GetKeyDown(KeyCode.Space) || Input.GetMouseButtonDown(0))
        {
            fire();
        }
    }

    void fire()
    {
        if (isFireLocked) return;
        isFireLocked = true;
        Instantiate(
            projectilePrefab,
            transform.position,
            transform.rotation
            );
    }
}
