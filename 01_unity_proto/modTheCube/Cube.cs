using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Cube : MonoBehaviour
{
    public MeshRenderer Renderer;

    // Colour
    public float rSpeed = 0.1f;
    public float gSpeed = 0.2f;
    public float bSpeed = 0.3f;
    public float r = 0f;
    public float g = 0f;
    public float b = 0f;

    // Scale pulse
    public float multScale = 5f;
    public int scaleMin = 1;
    public int scaleMax = 10;
    public bool lockScaleGoal = false;
    public int scaleGoal;
    public float scaleSpeed;


    void Start()
    {
        transform.position = new Vector3(3, 4, 1);
        transform.localScale = Vector3.one * multScale;

    }

    void Update()
    {
        // Rotate
        transform.Rotate(
            Random.Range(0f, 10f) * Time.deltaTime,
            Random.Range(0f, 10f) * Time.deltaTime,
            Random.Range(0f, 10f) * Time.deltaTime);

        // Colour
        if (r > 1 || r < 0) rSpeed *= -1;
        if (g > 1 || g < 0) gSpeed *= -1;
        if (b > 1 || b < 0) bSpeed *= -1;

        r += (rSpeed * Time.deltaTime);
        g += (gSpeed * Time.deltaTime);
        b += (bSpeed * Time.deltaTime);

        Renderer.material.color = new Color(r, g, b, 1f);

        // Scale
        // Case we are on making new goal
        if (!lockScaleGoal)
        {
            lockScaleGoal = true;
            scaleGoal = Random.Range(scaleMin, scaleMax);
            float diff = scaleGoal > transform.localScale.x ? 1f : -1f;
            scaleSpeed = Random.Range(0.3f, 1f) * diff;
        }
        // Case we reached the goal (check if we did)
        else if (scaleGoal == System.Math.Round(transform.localScale.x))
        {
            lockScaleGoal = false;
        }
        // Case of increment / decrement the scale
        else
        {
            multScale += scaleSpeed * Time.deltaTime;
            transform.localScale = Vector3.one * multScale;
        }
    }
}
