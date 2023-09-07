#include "IndexBuffer.h"
#include "Renderer.h"

IndexBuffer::IndexBuffer(const void *data, unsigned int count)
    : m_Count(count) // why do we need m_Count?
{
    ASSERT(sizeof(unsigned int) == sizeof(GLuint));
    
    GL_CALL(glGenBuffers(1, &m_RendererID));
    GL_CALL(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, m_RendererID));
    GL_CALL(glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(unsigned int) * count, data, GL_STATIC_DRAW));
}

IndexBuffer::~IndexBuffer()
{
    GL_CALL(glDeleteBuffers(1, &m_RendererID));
}

void IndexBuffer::Bind()
{
    GL_CALL(glBindBuffer(GL_ARRAY_BUFFER, m_RendererID));
}

void IndexBuffer::Unbind()
{
    GL_CALL(glBindBuffer(GL_ARRAY_BUFFER, 0));
}
