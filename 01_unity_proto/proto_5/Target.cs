using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Target : MonoBehaviour
{
    public int scoreValue = 5;
    private int randScoreRange = 5;

    public ParticleSystem explosionFX;

    private Rigidbody rb;
    private GameManager gameManager;

    private int minForce = 12;
    private int maxForce = 16;
    private float xRange = 4f;
    private float yStartBottom = -2;

    void Start()
    {
        rb = gameObject.GetComponent<Rigidbody>();
        gameManager = GameObject.Find("GameManager").GetComponent<GameManager>();
        if(scoreValue == 0)
        {
            scoreValue = Random.Range(-randScoreRange, randScoreRange);
        }
        Spawn();
    }

    private void OnMouseDown()
    {
        gameManager.AddScore(scoreValue);
        Instantiate(explosionFX, transform.position, explosionFX.transform.rotation);
        Destroy(gameObject);
    }

    private void OnTriggerEnter(Collider other)
    { // must be the only one trigger there (the Sensor)
        gameManager.AddScore(-scoreValue);
        Destroy(gameObject);
    }

    private void Spawn()
    {
        transform.position = new Vector3(Random.Range(-xRange, xRange), yStartBottom);

        rb.AddForce(Vector3.up * Random.Range(minForce, maxForce), ForceMode.Impulse);
        rb.AddTorque(RandomAngle(), RandomAngle(), RandomAngle());
    }

    private int RandomAngle()
    {
        return Random.Range(-10, 10);
    }
}
