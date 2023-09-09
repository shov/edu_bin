#include <iostream>
#include <fstream>
#include <string>
#include <GL/glew.h>
#include <GLFW/glfw3.h>

#include "Renderer.h"
#include "VertexBuffer.h"
#include "IndexBuffer.h"
#include "VertexArray.h"

// load shader from file function
static std::string LoadShaderFromFile(const std::string &filepath)
{
    std::ifstream stream(filepath);
    std::string line;
    std::string shader;

    // read file line by line
    while (getline(stream, line))
    {
        shader += line + "\n";
    }

    return shader;
}

static unsigned int CompileShader(unsigned int type, const std::string &source)
{
    unsigned int id = GL_CALL(glCreateShader(type));
    const char *src = source.c_str();
    GL_CALL(glShaderSource(id, 1, &src, nullptr));
    GL_CALL(glCompileShader(id));

    int result;
    GL_CALL(glGetShaderiv(id, GL_COMPILE_STATUS, &result));
    if (GL_FALSE == result)
    {
        int length;
        GL_CALL(glGetShaderiv(id, GL_INFO_LOG_LENGTH, &length));
        char *message = (char *)(alloca(length * sizeof(char)));
        GL_CALL(glGetShaderInfoLog(id, length, &length, message));
        std::cout << "Failed to compile " << (type == GL_VERTEX_SHADER ? "vertex" : "fragment") << " shader!"
                  << std::endl;
        std::cout << message << std::endl;
        GL_CALL(glDeleteShader(id));
        return 0;
    }
    return id;
}

static int CreateShader(const std::string &vertexShader, const std::string &fragmentShader)
{
    unsigned int program = GL_CALL(glCreateProgram());
    unsigned int vs = CompileShader(GL_VERTEX_SHADER, vertexShader);
    unsigned int fs = CompileShader(GL_FRAGMENT_SHADER, fragmentShader);

    GL_CALL(glAttachShader(program, vs));
    GL_CALL(glAttachShader(program, fs));
    GL_CALL(glLinkProgram(program));
    GL_CALL(glValidateProgram(program));

    GL_CALL(glDeleteShader(vs));
    GL_CALL(glDeleteShader(fs));

    return program;
}

void ValidateProgram(unsigned int shader)
{
    int result;
    GL_CALL(glGetProgramiv(shader, GL_VALIDATE_STATUS, &result));
    if (GL_FALSE == result)
    {
        int length;
        GL_CALL(glGetProgramiv(shader, GL_INFO_LOG_LENGTH, &length));
        char *message = (char *)(alloca(length * sizeof(char)));
        GL_CALL(glGetProgramInfoLog(shader, length, &length, message));
        std::cout << "Failed to validate program!" << std::endl;
        std::cout << message << std::endl;
    }
    else
    {
        std::cout << "Program validated successfully!" << std::endl;
    }
}

int main(void)
{
    GLFWwindow *window;

    // Init glfw
    if (!glfwInit())
        return -1;

    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    // Create windowed mode window and its OpenGL context
    window = glfwCreateWindow(800, 600, "TIK TAK", NULL, NULL);
    if (!window)
    {
        glfwTerminate();
        return -1;
    }

    // Make the window's context current
    glfwMakeContextCurrent(window);

    glfwSwapInterval(1);

    // Init glew. must be after glfwMakeContextCurrent
    if (glewInit() != GLEW_OK)
    {
        std::cout << "Error!" << std::endl;
    }
    else
    {
        std::cout << "GLEW INIT OK " << glGetString(GL_VERSION) << std::endl;
    }

    {
        float positions[] = {
            -0.5f, -0.5f,
            0.5f, -0.5f,
            -0.5f, 0.5f,
            0.5f, 0.5f};

        unsigned int indices[] = {
            2, 1, 3,
            2, 0, 1};

        VertexArray va;
        VertexBuffer vb(positions, 4 * 2 * sizeof(float));
        VertexBufferLayout layout;
        layout.Push<float>(2);
        va.AddBuffer(vb, layout);

        IndexBuffer ib(indices, 6);

        // Shaders
        std::string vertexShader = LoadShaderFromFile("../shaders/vertex.glsl");
        std::string fragmentShader = LoadShaderFromFile("../shaders/fragment.glsl");

        unsigned int shader = CreateShader(vertexShader, fragmentShader);
        GL_CALL(glUseProgram(shader));

        // uniform location u_Color
        GL_CALL(int location = glGetUniformLocation(shader, "u_Color"));
        ASSERT(-1 != location);

        // Check if program been validated successfully
        ValidateProgram(shader);

        // Unbind everything
        va.Unbind();
        GL_CALL(glUseProgram(0));
        vb.Unbind();
        ib.Unbind();

        float r = 0.0f;
        float increment = 0.01f;
        // Game loop
        while (!glfwWindowShouldClose(window))
        {
            // Render
            GL_CALL(glClear(GL_COLOR_BUFFER_BIT));

            // Bind shader
            GL_CALL(glUseProgram(shader));
            GL_CALL(glUniform4f(location, r, 0.5f, 0.5f, 1.0f));

            // Bind vertex array
            va.Bind();
            ib.Bind();

            // Draw a triangle
            GL_CALL(glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, nullptr));

            if (r > 1.0f)
            {
                increment = -0.01f;
            }
            else if (r < 0.0f)
            {
                increment = 0.01f;
            }
            r += increment;

            // Swap buffers
            GL_CALL(glfwSwapBuffers(window));

            // Poll events
            GL_CALL(glfwPollEvents());
        }

        GL_CALL(glDeleteProgram(shader));
    }
    glfwTerminate();
    return 0;
}