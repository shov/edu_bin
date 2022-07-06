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
        SpawnEnemy();
    }

    void Update()
    {
        InvokeRepeating(nameof(SpawnEnemy), 10, 7);
    }

    public void SpawnEnemy(int num = 1)
    {
        for (int i = 0; i < num; i++)
        {
            Instantiate(enemyPf, GenEnemySpawnPos(), enemyPf.transform.rotation);
        }
    }

    protected Vector3 GenEnemySpawnPos()
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
