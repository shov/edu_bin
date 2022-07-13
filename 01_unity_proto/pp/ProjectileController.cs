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

    public void Fire(GameObject enemy, GameObject player)
    {
        Vector3 fireTo = (enemy.transform.position - player.transform.position).normalized;
        transform.position = player.transform.position + fireTo;
        transform.LookAt(enemy.transform);
        transform.Rotate(90f, 0f, 0f);
        GetComponent<Rigidbody>().AddForce(fireTo * speed, ForceMode.Impulse);
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
