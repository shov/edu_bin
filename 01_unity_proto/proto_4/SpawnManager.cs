using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpawnManager : MonoBehaviour
{
    public float islandR = 10f;
    public GameObject enemyPf;
    public GameObject powerUpPf;
    private GameObject player;

    void Start()
    {
        player = GameObject.Find("Player");
        InvokeRepeating(nameof(SpawnEnemy), 2, 14);
        InvokeRepeating(nameof(SpawnPowerUp), 1, 20);
    }

    void Update()
    {
        
    }

    void SpawnEnemy()
    {
        Spawn(enemyPf, 1);
    }

    void SpawnPowerUp()
    {
        Spawn(powerUpPf, 1);
    }

    void Spawn(GameObject entity, int num = 1)
    {
        for (int i = 0; i < num; i++)
        {
            Instantiate(entity, RandPositionFarFromPlayer(), entity.transform.rotation);
        }
    }

    protected Vector3 RandPositionFarFromPlayer()
    {
        float x = Random.Range(-islandR, islandR);
        while (x < player.transform.position.x + 2 && x > player.transform.position.x - 2)
        {
            x = Random.Range(-islandR, islandR);
        }

        float z = Random.Range(-islandR, islandR);
        while (z < player.transform.position.z + 2 && z > player.transform.position.z - 2)
        {
            z = Random.Range(-islandR, islandR);
        }

        return new Vector3(x, 1.15f, z);
    }
}
