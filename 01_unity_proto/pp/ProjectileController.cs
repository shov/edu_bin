using System.Collections;
using UnityEngine;

public class ProjectileController : MonoBehaviour
{
    private float speed = 20f;
    private int lifeTime = 3;

    void Start()
    {
        StartCoroutine(RemoveByTimeout());
    }

    void Update()
    {
       
    }

    public void Fire(Vector3 direction)
    {
        transform.LookAt(direction);
        GetComponent<Rigidbody>().AddForce(direction * speed, ForceMode.Impulse);
    }

    IEnumerator RemoveByTimeout()
    {
        yield return new WaitForSeconds(lifeTime);
        Destroy(gameObject);
    }

    private void OnTriggerEnter(Collider other)
    {
        if(other.CompareTag("Enemy"))
        {
            // Interaction
            Destroy(gameObject);
        }
    }
}
