using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HitPoints : MonoBehaviour
{
    public float hp = 100f;

    private void OnTriggerEnter(Collider other)
    {
        if(other.CompareTag("Weapon"))
        {
            hp -= other.GetComponent<Weapon>().damage;
            if(hp <= 0)
            {
                Destroy(gameObject);
            }
        }
    }
}
