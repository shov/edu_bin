using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerControllerX : MonoBehaviour
{
    public GameObject dogPrefab;

    private bool lockDog = false;
    private int lockTimer = 1;

    // Update is called once per frame
    void Update()
    {
        // On spacebar press, send dog
        if (!lockDog && Input.GetKeyDown(KeyCode.Space))
        {
            lockDog = true;
            Instantiate(dogPrefab, transform.position, dogPrefab.transform.rotation);
            Invoke(nameof(unlockDog), lockTimer);
        }
    }

    void unlockDog()
    {
        lockDog = false;
    }
}
