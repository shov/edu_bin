using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    private Rigidbody playerRb;
    private Animator playerAnim;
    private AudioSource playerAudio;

    public ParticleSystem explosionFX;
    public ParticleSystem dirtSplatterFX;

    public AudioClip jumpSFX;
    public AudioClip crashSFX;

    public float JumpForce = 10;
    public float gravityModifier = 1;

    public bool isOnGround = true;
    public bool gameOver = false;

    void Start()
    {
        playerRb = GetComponent<Rigidbody>();
        playerAnim = GetComponent<Animator>();
        playerAudio = GetComponent<AudioSource>();
        Physics.gravity *= gravityModifier;
    }


    void Update()
    {
        if (!gameOver && isOnGround && Input.GetKeyDown(KeyCode.Space))
        {
            playerRb.AddForce(Vector3.up * JumpForce, ForceMode.Impulse);
            isOnGround = false;
            dirtSplatterFX.Stop();
            playerAudio.PlayOneShot(jumpSFX, 1f);
            playerAnim.SetTrigger("Jump_trig");
        }
    }

    private void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Ground"))
        {
            isOnGround = true;
            dirtSplatterFX.Play();
        }

        if (collision.gameObject.CompareTag("Obstacle"))
        {
            if (!gameOver)
            {
                Debug.Log("GAME OVER");
                gameOver = true;
                playerAnim.SetInteger("DeathType_int", 1);
                playerAnim.SetBool("Death_b", true);
                explosionFX.Play();
                playerAudio.PlayOneShot(crashSFX, 1f);
                dirtSplatterFX.Stop();
            }
        }
    }
}
