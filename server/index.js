const express = require('express');
const { ethers } = require('ethers'); //only using existing project resources

const app = express();
const port = 4099;

// 添加 CORS 中间件 add cors middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// 添加 JSON 解析中间件 add json parser middleware
app.use(express.json());

const provider = new ethers.providers.JsonRpcProvider('https://ethereum.publicnode.com');

// Albert.Lei-apitest 路由 add albert.lei api test route
app.get('/Albert.Lei-apitest/contract-info/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!ethers.utils.isAddress(address)) {
      console.log('Invalid address:', address);
      return res.status(400).json({ error: 'Invalid contract address' });
    }

    const [balance, code] = await Promise.all([
      provider.getBalance(address),
      provider.getCode(address)
    ]); //Parallel requests are used to retrieve contract information, improving the API response speed.

    const contractInfo = {
      address,
      balance: ethers.utils.formatEther(balance),
      isContract: code !== '0x',
      bytecodeSize: (code.length - 2) / 2
    };

    // 在控制台显示结果 show result in console
    console.log('Contract Information:', contractInfo);
    
    res.json(contractInfo);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch contract info' });
  }
});

// 添加健康检查端点 add health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 启动服务器 start server
app.listen(port, () => {
  console.log(`Albert.Lei-apitest server is running on port ${port}`);
  console.log(`Try: curl http://localhost:${port}/Albert.Lei-apitest/contract-info/0xdAC17F958D2ee523a2206206994597C13D831ec7`);
}); 