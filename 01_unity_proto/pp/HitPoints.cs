using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HitPoints : MonoBehaviour
{
    public float hp = 100f;

    public void DealDamage(float damage)
    {
        hp -= damage;
    }

    private void OnCollisionEnter(Collision collision)
    {
        if(collision.gameObject.CompareTag("Weapon"))
        {
            hp -= collision.gameObject.GetComponent<Weapon>().damage;
            if(hp <= 0)
            {
                Destroy(gameObject);
            }
        }
    }
}
