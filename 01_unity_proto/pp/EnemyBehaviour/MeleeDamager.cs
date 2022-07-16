using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MeleeDamager : MonoBehaviour
{
    public float noticeRande = 12f;
    public float speed = 100f;
    public float damage = 20f;
    public float attakSpeed = 0.4f;
    public HitPoints targetHP = null;
    public bool hitLocked = false;
    public float knockTimeout = 0.3f;
    public bool knocked = false;
    private Rigidbody rb;
    private GameObject player;
    private Vector3 spotPoint;
    private GameObject horn;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        player = GameObject.Find("Player");
        spotPoint = transform.position;
        StartCoroutine(SpotY());

        Transform hornTransform = transform.Find("Horn");
        if (null == hornTransform)
        {
            throw new System.Exception("All enemies that are only MD must have a horn!");
        }
        horn = hornTransform.gameObject;
    }

    IEnumerator SpotY()
    {
        yield return new WaitForSeconds(1);
        spotPoint.y = transform.position.y;
    }

    void Update()
    {
        if (Vector3.Distance(player.transform.position, transform.position) <= noticeRande && !knocked)
        {
            Vector3 moveDirection = player.transform.position - transform.position;
            rb.AddForce(moveDirection.normalized * speed);
            Debug.DrawRay(transform.position, moveDirection, Color.yellow);
            transform.LookAt(player.transform.position, transform.up);
        }

        if (Vector3.Distance(player.transform.position, transform.position) > noticeRande)
        {
            bool done = System.Math.Abs(transform.position.x - spotPoint.x) <= 0.1 && System.Math.Abs(transform.position.z - spotPoint.z) <= 0.1;
            if (!done)
            {
                Vector3 moveDirection = spotPoint - transform.position;
                rb.AddForce(moveDirection.normalized * speed);
                transform.LookAt(spotPoint, transform.up);
            }
        }

        if (!hitLocked && null != targetHP)
        {
            StartCoroutine(Hit());
        }
    }

    private void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Weapon") && !knocked)
        {
            StartCoroutine(KnockOut());
        }

        if (collision.gameObject.CompareTag("Player"))
        {
            targetHP = collision.gameObject.GetComponent<HitPoints>();
            if (!hitLocked)
            {
                StartCoroutine(Hit());
            }
        }
    }

    private void OnCollisionExit(Collision collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            targetHP = null;
        }
    }

    IEnumerator KnockOut()
    {
        knocked = true;
        rb.velocity = Vector3.zero;
        rb.angularVelocity = Vector3.zero;

        yield return new WaitForSeconds(knockTimeout);
        knocked = false;
    }

    IEnumerator Hit()
    {
        hitLocked = true;

        MeshRenderer mr = horn.GetComponent<MeshRenderer>();
        Color origin = mr.materials[0].color;
        mr.materials[0].SetColor("_Color", Color.yellow);

        if (null != targetHP)
        {
            targetHP.DealDamage(damage);
        }
        yield return new WaitForSeconds(attakSpeed);

        mr.materials[0].SetColor("_Color", origin);
        hitLocked = false;
    }
}
