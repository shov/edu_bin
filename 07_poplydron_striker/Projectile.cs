using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(MeshFilter))]
public class Projectile : MonoBehaviour
{
    private Striker striker;
    public TheStarController star;

    public float projectileSpeed = 40f;
    public bool alreadyHit = false;

    void Start()
    {
        // Star
        star = GameObject.Find("TheStar").GetComponent<TheStarController>();

        // Mesh
        Vector3[] vertices = {
             new Vector3(-0.5f, -0.5f, 0),
             new Vector3(0.5f, -0.5f, 0),
             new Vector3(0f, 0.5f, 0)
         };

        Vector2[] uv = {
             new Vector2(0, 0),
             new Vector2(1, 0),
             new Vector2(0.5f, 1)
         };

        int[] triangles = { 0, 1, 2 };

        var mesh = new Mesh();
        mesh.vertices = vertices;
        mesh.uv = uv;
        mesh.triangles = triangles;
        mesh.RecalculateBounds();
        mesh.RecalculateNormals();
        mesh.RecalculateTangents();

        GetComponent<MeshFilter>().mesh = mesh;

        striker = GameObject.Find("Striker").GetComponent<Striker>();
    }

    void Update()
    {
        Vector3 direction = Vector3.up;
        Ray strikeRay = new Ray(transform.position, transform.TransformDirection(direction));
        Debug.DrawRay(transform.position, transform.TransformDirection(direction));

        if(!alreadyHit && Physics.Raycast(strikeRay, out RaycastHit hit, 1f)) 
        {
            if (hit.collider.CompareTag("Target"))
            {
                alreadyHit = true;

                Target target = hit.collider.GetComponent<Target>();

                if (!target.loked)
                {
                    if (!target.ok.activeInHierarchy)
                    {
                        star.IncreaseGoalachived();
                        target.ok.SetActive(true);
                    }
                    else
                    {
                        star.DecreaseGoalAchived();
                        star.CallFail();
                        target.FailShot();
                    }
                }
            }
        }

        if (transform.position == Vector3.zero)
        {
            striker.isFireLocked = false;
            Destroy(gameObject);
            return;
        }

        // Move towards the kernel
        transform.position = Vector3.MoveTowards(transform.position, Vector3.zero, projectileSpeed * Time.deltaTime);
    }

    private void OnTriggerEnter(Collider other)
    {
        //if (other.CompareTag("Target"))
        //{
        //    striker.isFireLocked = false;
        //    if (!other.GetComponent<Target>().ok.activeInHierarchy && !alreadyHit)
        //    {
        //        alreadyHit = true;
        //        star.goalsAchieved++;
        //        other.GetComponent<Target>().ok.SetActive(true);
        //    }
        //    Destroy(gameObject);
        //}

    }
}
