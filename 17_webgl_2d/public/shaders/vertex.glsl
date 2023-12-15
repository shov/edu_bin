attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat3 u_world;
uniform vec2 u_frame_offset;

varying vec2 v_texCoord;

void main() {
    gl_Position = vec4(u_world * vec3(a_position, 1), 1);
    v_texCoord = a_texCoord + u_frame_offset;
}