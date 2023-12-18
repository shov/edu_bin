export type TMaterialShaderParemeter = {
  name: string;
  type: number;
  isUniform: true;
  location: WebGLUniformLocation;
} | {
  name: string;
  type: number;
  isUniform: false;
  location: number;
};

export class Material {
  public readonly program: WebGLProgram;

  protected parameterDict: Record<string, TMaterialShaderParemeter> = {};

  constructor(
    protected readonly gl: WebGL2RenderingContext,
    vs: string,
    fs: string,
  ) {

    const vsShader = this.getShader(vs, this.gl.VERTEX_SHADER);
    const fsShader = this.getShader(fs, this.gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    if (!program) {
      throw new Error('Cannot create program!');
    }

    this.program = program;

    this.gl.attachShader(this.program, vsShader);
    this.gl.attachShader(this.program, fsShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw new Error('Cannot load shader: ' + this.gl.getProgramInfoLog(this.program));
    }

    this.gatherParameters();

    this.gl.detachShader(this.program, vsShader);
    this.gl.detachShader(this.program, fsShader);
    this.gl.deleteShader(vsShader);
    this.gl.deleteShader(fsShader);

  };

  public gatherParameters() {
    const gl = this.gl;

    [gl.ACTIVE_ATTRIBUTES, gl.ACTIVE_UNIFORMS].forEach((type) => {
      const amountOfParams = gl.getProgramParameter(this.program, type);
      for (let i = 0; i < amountOfParams; i++) {
        const info = gl.ACTIVE_ATTRIBUTES === type ? gl.getActiveAttrib(this.program, i) : gl.getActiveUniform(this.program, i);
        if (!info) {
          throw new Error(`Cannot get active ${gl.ACTIVE_ATTRIBUTES === type ? 'attribute' : 'uniform'} info! Number: ${i}`);
        }

        const location = gl.ACTIVE_ATTRIBUTES === type ? gl.getAttribLocation(this.program, info.name) : gl.getUniformLocation(this.program, info.name);

        if (null === location) {
          throw new Error(`Cannot get active ${gl.ACTIVE_ATTRIBUTES === type ? 'attribute' : 'uniform'} location! Number: ${i}`);
        }

        this.parameterDict[info.name] = {
          name: info.name,
          type: info.type,
          isUniform: gl.ACTIVE_ATTRIBUTES !== type,
          location,
        } as TMaterialShaderParemeter;
      }
    });
  }

  public setParameterBindTexture(name: string, texture: WebGLTexture, unit: number): void
  {
    const gl = this.gl;
    const paramInfo = this.parameterDict[name];
    if (!paramInfo) {
      throw new Error(`Cannot find parameter ${name}!`);
    }

    if(!paramInfo.isUniform) {
      throw new Error(`Parameter ${name} is not uniform!`);
    }

    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(paramInfo.location, unit);
  }

  public setParameterBindBuffer(name: string, buffer: WebGLBuffer): void
  {
    const gl = this.gl;
    const paramInfo = this.parameterDict[name];
    if (!paramInfo) {
      throw new Error(`Cannot find parameter ${name}!`);
    }

    if(paramInfo.isUniform) {
      throw new Error(`Parameter ${name} is not attribute!`);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(paramInfo.location);
    this.setParameter(name);
  }

  public setParameter(name: string, type?: GLenum, normalized?: GLboolean, stride?: GLsizei, offset?: GLintptr): void;
  public setParameter(name: string, data: number | number[] | Float32Array, srcOffset?: GLuint, srcLength?: GLuint): void;
  public setParameter(name: string, x: GLfloat, y: GLfloat): void;
  public setParameter(name: string, x: GLfloat, y: GLfloat, z: GLfloat): void;
  public setParameter(name: string, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void;
  public setParameter(name: string, ...args: any[]): void {
    const paramRef = this.parameterDict[name];
    if (!paramRef) {
      throw new Error(`Cannot find parameter ${name}!`);
    }

    const gl = this.gl;

    if (paramRef.isUniform) {
      switch (paramRef.type) {
        case gl.FLOAT: gl.uniform1f(paramRef.location, args[0] as number); break;
        case gl.FLOAT_VEC2: gl.uniform2f(paramRef.location, args[0] as number, args[1] as number); break;
        case gl.FLOAT_VEC3: gl.uniform3f(paramRef.location, args[0] as number, args[1] as number, args[2] as number); break;
        case gl.FLOAT_VEC4: gl.uniform4f(paramRef.location, args[0] as number, args[1] as number, args[2] as number, args[3] as number); break;
        case gl.FLOAT_MAT2: gl.uniformMatrix2fv(paramRef.location, false, args[0] as Float32Array, args[1] as GLuint, args[2] as GLuint); break;
        case gl.FLOAT_MAT3: gl.uniformMatrix3fv(paramRef.location, false, args[0] as Float32Array, args[1] as GLuint, args[2] as GLuint); break;
        case gl.FLOAT_MAT4: gl.uniformMatrix4fv(paramRef.location, false, args[0] as Float32Array, args[1] as GLuint, args[2] as GLuint); break;
        case gl.INT: gl.uniform1i(paramRef.location, args[0] as number); break;
        case gl.INT_VEC2: gl.uniform2iv(paramRef.location, args[0] as number[], args[1] as GLuint, args[2] as GLuint); break;
        case gl.INT_VEC3: gl.uniform3iv(paramRef.location, args[0] as number[], args[1] as GLuint, args[2] as GLuint); break;
        case gl.INT_VEC4: gl.uniform4iv(paramRef.location, args[0] as number[], args[1] as GLuint, args[2] as GLuint); break;
        case gl.SAMPLER_2D: gl.uniform1i(paramRef.location, args[0] as number); break;
        case gl.SAMPLER_CUBE: gl.uniform1i(paramRef.location, args[0] as number); break;
        default: throw new Error(`Unknown parameter type ${paramRef.type}!`);
      }
    }

    if (!paramRef.isUniform) {
      const deflt = {
        type: gl.FLOAT || args[0], normalized: void 0 !== args[1] ? args[1] : false, stride: void 0 !== args[2] ? args[2] : 0, offset: void 0 !== args[3] ? args[3] : 0,
      }
      switch (paramRef.type) {
        case gl.FLOAT: gl.vertexAttribPointer(paramRef.location, 1, deflt.type, deflt.normalized, deflt.stride, deflt.offset); break;
        case gl.FLOAT_VEC2: gl.vertexAttribPointer(paramRef.location, 2, deflt.type, deflt.normalized, deflt.stride, deflt.offset); break;
        case gl.FLOAT_VEC3: gl.vertexAttribPointer(paramRef.location, 3, deflt.type, deflt.normalized, deflt.stride, deflt.offset); break;
        case gl.FLOAT_VEC4: gl.vertexAttribPointer(paramRef.location, 4, deflt.type, deflt.normalized, deflt.stride, deflt.offset); break;
        default: throw new Error(`Unknown parameter type ${paramRef.type}!`);
      }
    }
  }

  protected getShader(code: string, type: number): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error('Cannot create shader!');
    }

    this.gl.shaderSource(shader, code);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error('Shader compilation failed: ' + this.gl.getShaderInfoLog(shader));
    }

    return shader;
  }

}