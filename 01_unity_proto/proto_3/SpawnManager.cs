using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpawnManager : MonoBehaviour
{
    private Vector3 spawnPos = new Vector3(25, 0, 0);
    public GameObject obstaclePrefab;

    public float spawnMinDelay = 1;
    public float spawnMaxDelay = 3;
    private float startDelay = 2;

    private PlayerController playerController;

    void Start()
    {
        playerController = GameObject.Find("Player").GetComponent<PlayerController>();
        Invoke(nameof(SpawnObstacle), startDelay);
    }

    // Update is called once per frame
    void Update()
    {

    }

    void SpawnObstacle()
    {
        Instantiate(obstaclePrefab, spawnPos, obstaclePrefab.transform.rotation);

        if (!playerController.gameOver)
        {
            Invoke(nameof(SpawnObstacle), Random.Range(spawnMinDelay, spawnMaxDelay));
        }
    }
}
