using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 300f;
    private Rigidbody rb;

    // Attak
    public float attakRange = 7f;
    public GameObject projectilePf;
    private float attakSpeed = 0.8f;
    public float? memEnemyDistance = null;
    public GameObject memEnemy = null;
    public GameObject prevEnemy = null;
    public bool fireLocked = false;

    public void RegisterEnemy(GameObject enemy, float distance)
    {
        if (memEnemyDistance == null || memEnemyDistance > distance)
        {
            memEnemyDistance = distance;
            memEnemy = enemy;
            if (null != prevEnemy)
            {
                prevEnemy.GetComponent<EnemyController>().TargetRingOff();
            }
            prevEnemy = enemy;
            memEnemy.GetComponent<EnemyController>().TargetRingOn();
        }
    }

    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }


    // TODO fix moving!
    //public float prevMovingSum = 0f;
    void Update()
    {
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");
        float movingSum = System.Math.Abs(horizontalInput) + System.Math.Abs(verticalInput);

        //if (prevMovingSum <= movingSum && movingSum > 0.01)
        //{
        rb.AddForce((Vector3.forward * verticalInput + Vector3.right * horizontalInput).normalized * moveSpeed);
        //}
        //if(prevMovingSum > movingSum && movingSum < 0.1)
        //{
        //    rb.velocity = Vector3.zero;
        //    rb.angularVelocity = Vector3.zero;
        //}
        //prevMovingSum = movingSum;

        if (movingSum > 0.1 && null == memEnemy)
        {
            Vector3 moveDirection = new Vector3(horizontalInput * moveSpeed, 0f, verticalInput * moveSpeed) + transform.position;
            transform.LookAt(moveDirection);
        }

        if (null != memEnemy)
        {
            transform.LookAt(memEnemy.transform.position, transform.up);
        }

        else if (null != prevEnemy)
        {
            transform.LookAt(prevEnemy.transform.position, transform.up);
        }

        ManageEnemies();
    }

    private void ManageEnemies()
    {
        if (null != memEnemy && !fireLocked)
        {
            fireLocked = true;

            GameObject projectile = Instantiate(projectilePf);
            ProjectileController pClr = projectile.GetComponent<ProjectileController>();
            pClr.Fire(memEnemy, gameObject);
            memEnemy = null;
            memEnemyDistance = null;
            StartCoroutine(UnlockFire());
        }

        if (memEnemy == null && null != prevEnemy)
        {
            prevEnemy.GetComponent<EnemyController>().TargetRingOff();
            prevEnemy = null;
        }
    }

    private IEnumerator UnlockFire()
    {
        yield return new WaitForSeconds(attakSpeed);
        fireLocked = false;
    }
}
