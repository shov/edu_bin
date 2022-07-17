using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TextController : MonoBehaviour
{
    void Start()
    {
        gameObject.GetComponent<Rigidbody>().AddForce(Vector3.up * 12, ForceMode.Impulse);
        StartCoroutine(LifeTime());
    }

    IEnumerator LifeTime()
    {
        yield return new WaitForSeconds(1.5f);
        Destroy(gameObject);
    }
}
