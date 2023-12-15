export class Material {
  public readonly program: WebGLProgram;

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

    this.gl.detachShader(this.program, vsShader);
    this.gl.detachShader(this.program, fsShader);
    this.gl.deleteShader(vsShader);
    this.gl.deleteShader(fsShader);

  };

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