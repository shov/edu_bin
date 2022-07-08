using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpawnManager : MonoBehaviour
{
    public float islandR = 10f;
    public GameObject enemyPf;
    public GameObject powerUpPf;
    private GameObject player;

    private int liveEnemyCount = 1;
    public bool spawnBlocked = false;
    private int prevWave = 1;
    public int waveSize = 1;
    private int timeToGetPU = 4; // sec

    void Start()
    {
        player = GameObject.Find("Player");
    }

    void Update()
    {
        liveEnemyCount = FindObjectsOfType<Enemy>(false).Length;
        if(liveEnemyCount == 0 && !spawnBlocked)
        {
            spawnBlocked = true;
            SpawnPowerUp(waveSize / 2);
            StartCoroutine( delayedSpawnEnemy(waveSize, waveSize / 2 * timeToGetPU) );
            waveSize += prevWave;
            prevWave = waveSize - prevWave;
        }
    }

    IEnumerator delayedSpawnEnemy(int num, int delay)
    {
        yield return new WaitForSeconds(delay);
        SpawnEnemy(num);
        spawnBlocked = false;
    }

    void SpawnEnemy(int num = 1)
    {
        Spawn(enemyPf, num);
    }

    void SpawnPowerUp(int num = 1)
    {
        Spawn(powerUpPf, num);
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
