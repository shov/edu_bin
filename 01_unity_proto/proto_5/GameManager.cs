using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public List<GameObject> targetList;
    public float spawnTimer = 2f;

    void Start()
    {
        StartCoroutine(SpawnTarget());
    }

    void Update()
    {
        
    }

    IEnumerator SpawnTarget()
    {
        while (true)
        {
            yield return new WaitForSeconds(spawnTimer);
            int index = Random.Range(0, targetList.Count);

            Instantiate(targetList[index]);
        }
    }
}
