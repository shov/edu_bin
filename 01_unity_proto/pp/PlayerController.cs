using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 10f;
    private Rigidbody rb;

    // Attak
    public float attakRange = 20f;
    public GameObject projectilePf;
    private float attakSpeed = 0.5f;
    private float memEnemyDistance;
    private GameObject memEnemy = null;
    private bool fireLocked = false;

    public void RegisterEnemy(GameObject enemy, float distance)
    {
        if (memEnemyDistance == default || memEnemyDistance > distance)
        {
            memEnemyDistance = distance;
            memEnemy = enemy;
        }
    }

    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }

    void Update()
    {
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");

        rb.AddForce(Vector3.forward * moveSpeed * verticalInput);
        rb.AddForce(Vector3.right * moveSpeed * horizontalInput);
        //transform.Translate(Vector3.forward * verticalInput * Time.deltaTime + Vector3.right * horizontalInput * Time.deltaTime, Space.World);

        if (System.Math.Abs(horizontalInput) + System.Math.Abs(verticalInput) > 0)
        {
            Vector3 moveDirection = new Vector3(horizontalInput * moveSpeed, 0f, verticalInput * moveSpeed) + transform.position;
            transform.LookAt(moveDirection);
        }

        ManageEnemies();
    }

    private void ManageEnemies()
    {
        if (null != memEnemy && !fireLocked)
        {
            fireLocked = true;
            Vector3 fireTo = (memEnemy.transform.position - transform.position).normalized;
            GameObject projectile = Instantiate(projectilePf, transform.position + new Vector3(0f, 1.5f, 2f), projectilePf.transform.rotation);
            ProjectileController pClr = projectile.GetComponent<ProjectileController>();
            pClr.Fire(fireTo);
            memEnemy = null;
            memEnemyDistance = default;
            StartCoroutine(UnlockFire());
        }
    }

    private IEnumerator UnlockFire()
    {
        yield return new WaitForSeconds(attakSpeed);
        fireLocked = false;
    }
}
