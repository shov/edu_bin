#ifndef DEVICE_H
#define DEVICE_H

#pragma comment(lib, "d3d11.lib")
#pragma comment(lib, "dxgi.lib")
#pragma comment(lib, "d3dcompiler.lib")

#include "global.h"
#include <stdexcept>
#include <d3d11.h>
#include <directxmath.h>
using namespace DirectX;

class Direct3D
{
private:
    bool m_vsync_enabled;
    int m_videoCardMemory;
    wchar_t  m_videoCardDescription[128];

    IDXGISwapChain *m_swapChain;
    ID3D11Device *m_device;
    ID3D11DeviceContext *m_deviceContext;

    ID3D11RenderTargetView *m_renderTargetView;

    ID3D11Texture2D *m_depthStencilBuffer;

    ID3D11DepthStencilState *m_depthStencilState;
    ID3D11DepthStencilView *m_depthStencilView;
    ID3D11RasterizerState *m_rasterState;

    XMMATRIX m_projectionMatrix;
    XMMATRIX m_worldMatrix;
    XMMATRIX m_orthoMatrix;

    D3D11_VIEWPORT m_viewport;

    void LookUpDisplayAndAdapter(int width, int height, UINT& numerator, UINT& denominator, int& videoCardMemory, wchar_t* videoCardDescription);
    void CreateSwapChainAndDevice(int width, int height, bool vsync, UINT numerator, UINT denominator, HWND hwnd, bool fullscreen);
    void CreateRenderTargetView();
public:
    Direct3D();
    ~Direct3D();

    void Setup(int width, int height, bool vsync, HWND hwnd, bool fullscreen, float screenDepth, float screenNear);
    void Shutdown();

    ID3D11Device* GetDevice();
    ID3D11DeviceContext* GetDeviceContext();

    void CopyProjectionMatrix(XMMATRIX&);
    void CopyWorldMatrix(XMMATRIX&);
    void CopyOrthoMatrix(XMMATRIX&);

    void ClearBackBuffer(XMFLOAT4 color);
    void PresentBackBuffer();

    void CopyVideoCardInfo(wchar_t*, int&);
    void SetBackBufferRenderTarget();
    void ResetViewport();
};

#endif