using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyController : MonoBehaviour
{
    private GameObject player;
    private PlayerController playerClr;
    void Start()
    {
        player = GameObject.Find("Player");
        playerClr = player.GetComponent<PlayerController>();
    }

    // Update is called once per frame
    void Update()
    {
        float distanceToPlayer = Vector3.Distance(player.transform.position, transform.position);
        if (distanceToPlayer <= playerClr.attakRange)
        {
            playerClr.RegisterEnemy(gameObject, distanceToPlayer);
        }
    }
}
