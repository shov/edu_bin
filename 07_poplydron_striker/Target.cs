using System.Collections;
using UnityEngine;

public class Target : MonoBehaviour
{
    public GameObject ok;
    public GameObject fail;
    public bool loked = false;

    void Start()
    {
        ok = transform.Find("ok").gameObject;
        fail = transform.Find("fail").gameObject;
    }

    public void FailShot()
    {
        StartCoroutine(FailShotCoRoutine());
    }
    IEnumerator FailShotCoRoutine()
    {
        loked = true;
        ok.SetActive(false);
        fail.SetActive(true);
        yield return new WaitForSeconds(0.5f);
        fail.SetActive(false);
        loked = false;
    }

    void Update()
    {
        
    }

}
