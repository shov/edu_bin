using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyController : MonoBehaviour
{
    private GameObject player;
    private PlayerController playerClr;
    private GameObject targetRing;
    void Start()
    {
        player = GameObject.Find("Player");
        playerClr = player.GetComponent<PlayerController>();
        Transform targetTransform = transform.Find("Target");
        if(null == targetTransform)
        {
            throw new System.Exception("Cnnot find target ring!");
        }
        targetRing = targetTransform.gameObject;
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

    public void TargetRingOn()
    {
        targetRing.SetActive(true);
    }

    public void TargetRingOff()
    {
        targetRing.SetActive(false);
    }
}
