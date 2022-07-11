using System.Collections;
using UnityEngine;

public class ProjectileController : MonoBehaviour
{
    public float speed = 1f;
    public Vector3 direction = Vector3.forward;
    public int lifeTime = 3;

    private Rigidbody rb;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        StartCoroutine(RemoveByTimeout());
        rb.AddForce(direction * speed, ForceMode.Impulse);
    }

    void Update()
    {
       
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
