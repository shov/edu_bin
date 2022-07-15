using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerHitPoints : HitPoints
{
    private void OnTriggerEnter(Collider other)
    {
        if(other.CompareTag("Weapon"))
        {
            // nothing happens
        }
    }

    private void Update()
    {
        if (hp <= 0)
        {
            Destroy(gameObject);
        }
    }
}
