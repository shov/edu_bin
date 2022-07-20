using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class GameManager : MonoBehaviour
{
    public List<GameObject> targetList;
    public float spawnTimer = 2f;

    public int score = 0;
    public TextMeshProUGUI scoreText;
    public TextMeshProUGUI gameOverText;

    private bool isGameActive;

    void Start()
    {
        isGameActive = true;
        StartCoroutine(SpawnTarget());
        AddScore(0);
    }

    void Update()
    {
        
    }

    public void AddScore(int added)
    {
        score += added;
        scoreText.text = "Score: " + score;
    }

    IEnumerator SpawnTarget()
    {
        while (isGameActive)
        {
            yield return new WaitForSeconds(spawnTimer);
            int index = Random.Range(0, targetList.Count);

            Instantiate(targetList[index]);
        }
    }

    public void GameOver()
    {
        isGameActive = false;
        gameOverText.gameObject.SetActive(true);
    }
}