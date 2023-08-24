#include "direct3d.h"

Direct3D::Direct3D()
{
    m_swapChain = NULL;
    m_device = NULL;
    m_deviceContext = NULL;
    m_renderTargetView = NULL;
    m_depthStencilBuffer = NULL;
    m_depthStencilState = NULL;
    m_depthStencilView = NULL;
    m_rasterState = NULL;
};

Direct3D::~Direct3D(){};

void Direct3D::LookUpDisplayAndAdapter(int width, int height, UINT &numerator, UINT &denominator, int &videoCardMemory, wchar_t *videoCardDescription)
{
    // common var to get results to
    HRESULT result;

    // DirectX graphics factory
    IDXGIFactory *factory;
    result = CreateDXGIFactory(__uuidof(IDXGIFactory), (void **)&factory);
    if (FAILED(result))
    {
        throw std::exception("Failed to create DXGIFactory");
    }

    // DirectX graphics adapter
    IDXGIAdapter *adapter;
    result = factory->EnumAdapters(0, &adapter);
    if (FAILED(result))
    {
        throw std::exception("Failed to enumerate adapters");
    }

    // DirectX output (monitor)
    IDXGIOutput *adapterOutput;
    result = adapter->EnumOutputs(0, &adapterOutput);
    if (FAILED(result))
    {
        throw std::exception("Failed to enumerate outputs");
    }

    // DXGI_FORMAT_R8G8B8A8_UNORM mods available for the adapter output
    unsigned int numModes;
    result = adapterOutput->GetDisplayModeList(DXGI_FORMAT_R8G8B8A8_UNORM, DXGI_ENUM_MODES_INTERLACED, &numModes, NULL);
    if (FAILED(result))
    {
        throw std::exception("Failed to get display mode list");
    }

    // List of all possible display modes for the adapter output
    DXGI_MODE_DESC *displayModeList = new DXGI_MODE_DESC[numModes];
    if (!displayModeList)
    {
        throw std::exception("Failed to create display mode list");
    }

    // Fill the display mode list
    result = adapterOutput->GetDisplayModeList(DXGI_FORMAT_R8G8B8A8_UNORM, DXGI_ENUM_MODES_INTERLACED, &numModes, displayModeList);
    if (FAILED(result))
    {
        throw std::exception("Failed to fill display mode list");
    }

    // Find the display mode that matches the screen width and height
    for (unsigned int i = 0; i < numModes; i++)
    {
        if (displayModeList[i].Width == (unsigned int)width)
        {
            if (displayModeList[i].Height == (unsigned int)height)
            {
                numerator = displayModeList[i].RefreshRate.Numerator;
                denominator = displayModeList[i].RefreshRate.Denominator;
                // The lastest display mode is with highest refresh rate, what fits us
            }
        }
    }

    // Get the video adapter description
    DXGI_ADAPTER_DESC adapterDesc;
    result = adapter->GetDesc(&adapterDesc);
    if (FAILED(result))
    {
        throw std::exception("Failed to get video adapter description");
    }

    // Video card memory in MB
    videoCardMemory = (int)(adapterDesc.DedicatedVideoMemory / 1024 / 1024);

    // Store video card name
    int errno_t = wcscpy_s(videoCardDescription, 128, adapterDesc.Description);
    if (errno_t != 0)
    {
        throw std::exception("Failed to copy video card description");
    }

    // Remove displayModeList
    delete[] displayModeList;
    displayModeList = NULL;

    // Remove adapterOutput
    adapterOutput->Release();
    adapterOutput = NULL;

    // Remove adapter
    adapter->Release();
    adapter = NULL;

    // Remove factory
    factory->Release();
    factory = NULL;

    return;
};

void Direct3D::CreateSwapChainAndDevice(int width, int height, bool vsync, UINT numerator, UINT denominator, HWND hwnd, bool fullscreen)
{
    // DirectX swap chain
    DXGI_SWAP_CHAIN_DESC swapChainDesc;
    ZeroMemory(&swapChainDesc, sizeof(swapChainDesc));

    // Single back buffer
    swapChainDesc.BufferCount = 1;

    // Set the width and height of the back buffer
    swapChainDesc.BufferDesc.Width = width;
    swapChainDesc.BufferDesc.Height = height;

    // Set regular 32-bit surface for the back buffer
    swapChainDesc.BufferDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;

    // Set the refresh rate of the back buffer
    if (vsync)
    {
        swapChainDesc.BufferDesc.RefreshRate.Numerator = numerator;
        swapChainDesc.BufferDesc.RefreshRate.Denominator = denominator;
    }
    else
    {
        swapChainDesc.BufferDesc.RefreshRate.Numerator = 0;
        swapChainDesc.BufferDesc.RefreshRate.Denominator = 1;
    }

    // Set the usage of the back buffer
    swapChainDesc.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;

    // Set the handle for the window to render to
    swapChainDesc.OutputWindow = hwnd;

    // Turn multisampling off
    swapChainDesc.SampleDesc.Count = 1;
    swapChainDesc.SampleDesc.Quality = 0;

    // Set to full screen or windowed mode
    if (fullscreen)
    {
        swapChainDesc.Windowed = false;
    }
    else
    {
        swapChainDesc.Windowed = true;
    }

    // Set the scan line ordering and scaling to unspecified
    swapChainDesc.BufferDesc.ScanlineOrdering = DXGI_MODE_SCANLINE_ORDER_UNSPECIFIED;
    swapChainDesc.BufferDesc.Scaling = DXGI_MODE_SCALING_UNSPECIFIED;

    // Discard the back buffer contents after presenting
    swapChainDesc.SwapEffect = DXGI_SWAP_EFFECT_DISCARD;

    // No advanced flags
    swapChainDesc.Flags = 0;

    // DirectX feature level DirectX 11.
    D3D_FEATURE_LEVEL featureLevel = D3D_FEATURE_LEVEL_11_0;

    // Create the swap chain, Direct3D device, and Direct3D device context
    HRESULT result = D3D11CreateDeviceAndSwapChain(
        NULL,
        D3D_DRIVER_TYPE_HARDWARE,
        NULL,
        0,
        &featureLevel,
        1,
        D3D11_SDK_VERSION,
        &swapChainDesc,
        &m_swapChain,
        &m_device,
        NULL,
        &m_deviceContext);

    if (FAILED(result))
    {
        throw std::exception("Failed to create swap chain, device and device context");
    }
}

void Direct3D::CreateRenderTargetView()
{
    // Get the pointer to the back buffer
    ID3D11Texture2D *backBufferPtr;
    HRESULT result = m_swapChain->GetBuffer(0, __uuidof(ID3D11Texture2D), (LPVOID *)&backBufferPtr);
    if (FAILED(result))
    {
        throw std::exception("Failed to get pointer to the back buffer");
    }

    // Create the render target view with the back buffer pointer
    result = m_device->CreateRenderTargetView(backBufferPtr, NULL, &m_renderTargetView);
    if (FAILED(result))
    {
        throw std::exception("Failed to create render target view");
    }

    // Remove backBufferPtr
    backBufferPtr->Release();
    backBufferPtr = NULL;
}

void Direct3D::Setup(int width, int height, bool vsync, HWND hwnd, bool fullscreen, float screenDepth, float screenNear)
{
    // common var to get results to
    HRESULT result;

    // numerator is like 60 or 144 frames per cycle
    // denominator is like 1 means the whole cycle takes 1 second
    // so 60/1 is 60 frames per second (60 Hz)
    UINT numerator = 0;
    UINT denominator = 0;
    LookUpDisplayAndAdapter(
        width,
        height,
        numerator,
        denominator,
        m_videoCardMemory,
        m_videoCardDescription);

    // Swap chain, device and device context
    CreateSwapChainAndDevice(
        width,
        height,
        vsync,
        numerator,
        denominator,
        hwnd,
        fullscreen);

    // Render target view
    CreateRenderTargetView();

    // Depth buffer
    D3D11_TEXTURE2D_DESC depthBufferDesc;
    ZeroMemory(&depthBufferDesc, sizeof(depthBufferDesc));

    // Set up the description of the depth buffer
    depthBufferDesc.Width = width;
    depthBufferDesc.Height = height;
    depthBufferDesc.MipLevels = 1;
    depthBufferDesc.ArraySize = 1;
    depthBufferDesc.Format = DXGI_FORMAT_D24_UNORM_S8_UINT;
    depthBufferDesc.SampleDesc.Count = 1;
    depthBufferDesc.SampleDesc.Quality = 0;
    depthBufferDesc.Usage = D3D11_USAGE_DEFAULT;
    depthBufferDesc.BindFlags = D3D11_BIND_DEPTH_STENCIL;
    depthBufferDesc.CPUAccessFlags = 0;
    depthBufferDesc.MiscFlags = 0;

    // Texture for depth buffer
    result = m_device->CreateTexture2D(&depthBufferDesc, NULL, &m_depthStencilBuffer);
    if (FAILED(result))
    {
        throw std::exception("Failed to create depth buffer texture");
    }

    // Depth stencil state
    D3D11_DEPTH_STENCIL_DESC depthStencilDesc;
    ZeroMemory(&depthStencilDesc, sizeof(depthStencilDesc));

    // Set up the description of the stencil state
    depthStencilDesc.DepthEnable = true;
    depthStencilDesc.DepthWriteMask = D3D11_DEPTH_WRITE_MASK_ALL;
    depthStencilDesc.DepthFunc = D3D11_COMPARISON_LESS;

    depthStencilDesc.StencilEnable = true;
    depthStencilDesc.StencilReadMask = 0xFF;
    depthStencilDesc.StencilWriteMask = 0xFF;

    // Stencil operations if pixel is front-facing.
    depthStencilDesc.FrontFace.StencilFailOp = D3D11_STENCIL_OP_KEEP;
    depthStencilDesc.FrontFace.StencilDepthFailOp = D3D11_STENCIL_OP_INCR;
    depthStencilDesc.FrontFace.StencilPassOp = D3D11_STENCIL_OP_KEEP;
    depthStencilDesc.FrontFace.StencilFunc = D3D11_COMPARISON_ALWAYS;

    // Stencil operations if pixel is back-facing.
    depthStencilDesc.BackFace.StencilFailOp = D3D11_STENCIL_OP_KEEP;
    depthStencilDesc.BackFace.StencilDepthFailOp = D3D11_STENCIL_OP_DECR;
    depthStencilDesc.BackFace.StencilPassOp = D3D11_STENCIL_OP_KEEP;
    depthStencilDesc.BackFace.StencilFunc = D3D11_COMPARISON_ALWAYS;

    // Create the depth stencil state
    result = m_device->CreateDepthStencilState(&depthStencilDesc, &m_depthStencilState);
    if (FAILED(result))
    {
        throw std::exception("Failed to create depth stencil state");
    }

    // Set the depth stencil state
    m_deviceContext->OMSetDepthStencilState(m_depthStencilState, 1);

    // Depth stencil view
    D3D11_DEPTH_STENCIL_VIEW_DESC depthStencilViewDesc;
    ZeroMemory(&depthStencilViewDesc, sizeof(depthStencilViewDesc));

    // Set up the depth stencil view description
    depthStencilViewDesc.Format = DXGI_FORMAT_D24_UNORM_S8_UINT;
    depthStencilViewDesc.ViewDimension = D3D11_DSV_DIMENSION_TEXTURE2D;
    depthStencilViewDesc.Texture2D.MipSlice = 0;

    // Create the depth stencil view
    result = m_device->CreateDepthStencilView(m_depthStencilBuffer, &depthStencilViewDesc, &m_depthStencilView);
    if (FAILED(result))
    {
        throw std::exception("Failed to create depth stencil view");
    }

    // Bind the render target view and depth stencil buffer to the output render pipeline
    m_deviceContext->OMSetRenderTargets(1, &m_renderTargetView, m_depthStencilView);

    // Rasterizer state
    D3D11_RASTERIZER_DESC rasterDesc;
    ZeroMemory(&rasterDesc, sizeof(rasterDesc));

    // Set up the raster description which will determine how and what polygons will be drawn
    rasterDesc.AntialiasedLineEnable = false;
    rasterDesc.CullMode = D3D11_CULL_BACK;
    rasterDesc.DepthBias = 0;
    rasterDesc.DepthBiasClamp = 0.0f;
    rasterDesc.DepthClipEnable = true;
    rasterDesc.FillMode = D3D11_FILL_SOLID;
    rasterDesc.FrontCounterClockwise = false;
    rasterDesc.MultisampleEnable = false;
    rasterDesc.ScissorEnable = false;
    rasterDesc.SlopeScaledDepthBias = 0.0f;

    // Create the rasterizer state from the description we just filled out.
    result = m_device->CreateRasterizerState(&rasterDesc, &m_rasterState);
    if (FAILED(result))
    {
        throw std::exception("Failed to create rasterizer state");
    }

    // Set the rasterizer state
    m_deviceContext->RSSetState(m_rasterState);

    // Viewport
    m_viewport.Width = (float)width;
    m_viewport.Height = (float)height;
    m_viewport.MinDepth = 0.0f;
    m_viewport.MaxDepth = 1.0f;
    m_viewport.TopLeftX = 0.0f;
    m_viewport.TopLeftY = 0.0f;

    // Create the viewport
    m_deviceContext->RSSetViewports(1, &m_viewport);

    // Projection matrix
    float fieldOfView = (float)XM_PI / 4.0f;
    float screenAspect = (float)width / (float)height;

    // Create the projection matrix for 3D rendering
    m_projectionMatrix = XMMatrixPerspectiveFovLH(fieldOfView, screenAspect, screenNear, screenDepth);

    // World matrix
    m_worldMatrix = XMMatrixIdentity();

    // Ortho matrix
    m_orthoMatrix = XMMatrixOrthographicLH((float)width, (float)height, screenNear, screenDepth);

    return;
}

void Direct3D::Shutdown()
{
    if (m_swapChain)
    {
        m_swapChain->SetFullscreenState(false, NULL);
    }

    if (m_rasterState)
    {
        m_rasterState->Release();
        m_rasterState = NULL;
    }

    if (m_depthStencilView)
    {
        m_depthStencilView->Release();
        m_depthStencilView = NULL;
    }

    if (m_depthStencilState)
    {
        m_depthStencilState->Release();
        m_depthStencilState = NULL;
    }

    if (m_depthStencilBuffer)
    {
        m_depthStencilBuffer->Release();
        m_depthStencilBuffer = NULL;
    }

    if (m_renderTargetView)
    {
        m_renderTargetView->Release();
        m_renderTargetView = NULL;
    }

    if (m_deviceContext)
    {
        m_deviceContext->Release();
        m_deviceContext = NULL;
    }

    if (m_device)
    {
        m_device->Release();
        m_device = NULL;
    }

    if (m_swapChain)
    {
        m_swapChain->Release();
        m_swapChain = NULL;
    }

    return;
}

void Direct3D::CopyProjectionMatrix(XMMATRIX &projectionMatrix)
{
    projectionMatrix = m_projectionMatrix;
    return;
}

void Direct3D::CopyWorldMatrix(XMMATRIX &worldMatrix)
{
    worldMatrix = m_worldMatrix;
    return;
}

void Direct3D::CopyOrthoMatrix(XMMATRIX &orthoMatrix)
{
    orthoMatrix = m_orthoMatrix;
    return;
}

void Direct3D::ClearBackBuffer(XMFLOAT4 color)
{
    // Clear the back buffer
    float colorArray[4] = {color.x, color.y, color.z, color.w};
    m_deviceContext->ClearRenderTargetView(m_renderTargetView, colorArray);

    // Clear the depth buffer
    m_deviceContext->ClearDepthStencilView(m_depthStencilView, D3D11_CLEAR_DEPTH, 1.0f, 0);

    return;
}

void Direct3D::PresentBackBuffer()
{
    // Present the back buffer to the screen since rendering is complete
    if (m_vsync_enabled)
    {
        // Lock to screen refresh rate
        m_swapChain->Present(1, 0);
        return;
    }

    // Present as fast as possible
    m_swapChain->Present(0, 0);

    return;
}

void Direct3D::CopyVideoCardInfo(wchar_t *cardName, int &memry)
{
    wcscpy_s(cardName, 128, m_videoCardDescription);
    memry = m_videoCardMemory;
    return;
}

void Direct3D::SetBackBufferRenderTarget()
{
    // Bind the render target view and depth stencil buffer to the output render pipeline
    m_deviceContext->OMSetRenderTargets(1, &m_renderTargetView, m_depthStencilView);
    return;
}

void Direct3D::ResetViewport()
{
    // Set the viewport
    m_deviceContext->RSSetViewports(1, &m_viewport);
    return;
}
