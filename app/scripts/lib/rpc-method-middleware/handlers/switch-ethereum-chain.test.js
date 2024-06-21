import {
  CHAIN_IDS,
  NETWORK_TYPES,
} from '../../../../../shared/constants/network';
import switchEthereumChain from './switch-ethereum-chain';

const NON_INFURA_CHAIN_ID = '0x123456789';

const mockRequestUserApproval = ({ requestData }) => {
  return Promise.resolve(requestData.toNetworkConfiguration);
};

const createMockMainnetConfiguration = () => ({
  id: 123,
  chainId: CHAIN_IDS.MAINNET,
  type: NETWORK_TYPES.MAINNET,
});

const createMockLineaMainnetConfiguration = () => ({
  id: 1234,
};
const MOCK_HIZOCO_CONFIGURATION={
  id:123,
  chainId: CHAIN_IDS.HIZOCO,
  type: NETWORK_TYPES.HIZOCO,
}
const MOCK_LINEA_MAINNET_CONFIGURATION = {
  id: 123,
  chainId: CHAIN_IDS.LINEA_MAINNET,
  type: NETWORK_TYPES.LINEA_MAINNET,
});

describe('switchEthereumChainHandler', () => {
  const makeMocks = ({
    permissionedChainIds = [],
    permissionsFeatureFlagIsActive = false,
    overrides = {},
    mockedFindNetworkConfigurationByReturnValue = createMockMainnetConfiguration(),
    mockedGetCurrentChainIdForDomainReturnValue = NON_INFURA_CHAIN_ID,
  } = {}) => {
    const mockGetCaveat = jest.fn();
    mockGetCaveat.mockReturnValue({ value: permissionedChainIds });

    return {
      getChainPermissionsFeatureFlag: () => permissionsFeatureFlagIsActive,
      getCurrentChainIdForDomain: jest
        .fn()
        .mockReturnValue(mockedGetCurrentChainIdForDomainReturnValue),
      setNetworkClientIdForDomain: jest.fn(),
      findNetworkConfigurationBy: jest
        .fn()
        .mockReturnValue(mockedFindNetworkConfigurationByReturnValue),
      setActiveNetwork: jest.fn(),
      requestUserApproval: jest
        .fn()
        .mockImplementation(mockRequestUserApproval),
      requestPermittedChainsPermission: jest.fn(),
      getCaveat: mockGetCaveat,
      ...overrides,
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('with permittedChains permissioning inactive', () => {
    const permissionsFeatureFlagIsActive = false;

    it('should call setActiveNetwork when switching to a built-in infura network', async () => {
      const mocks = makeMocks({
        permissionsFeatureFlagIsActive,
        overrides: {
          findNetworkConfigurationBy: jest
            .fn()
            .mockReturnValue(createMockMainnetConfiguration()),
        },
      });
      const switchEthereumChainHandler = switchEthereumChain.implementation;
      await switchEthereumChainHandler(
        {
          origin: 'example.com',
          params: [{ chainId: CHAIN_IDS.MAINNET }],
        },
        {},
        jest.fn(),
        jest.fn(),
        mocks,
      );
      expect(mocks.setActiveNetwork).toHaveBeenCalledTimes(1);
      expect(mocks.setActiveNetwork).toHaveBeenCalledWith(
        createMockMainnetConfiguration().type,
      );
    });
  it('should call setProviderType when switching to a built in infura network', async () => {
    const mockSetProviderType = jest.fn();
    const mockSetActiveNetwork = jest.fn();
    const switchEthereumChainHandler = switchEthereumChain.implementation;
    await switchEthereumChainHandler(
      {
        origin: 'example.com',
        params: [{ chainId: CHAIN_IDS.MAINNET }],
      },
      {},
      jest.fn(),
      jest.fn(),
      {
        getCurrentChainId: () => NON_INFURA_CHAIN_ID,
        findNetworkClientIdByChainId: () => 123,
        setNetworkClientIdForDomain: jest.fn(),
        getProviderConfig: () => ({ chainId: NON_INFURA_CHAIN_ID }),
        findNetworkConfigurationBy: () => MOCK_MAINNET_CONFIGURATION,
        setProviderType: mockSetProviderType,
        setActiveNetwork: mockSetActiveNetwork,
        requestUserApproval: mockRequestUserApproval,
      },
    );
    expect(mockSetProviderType).toHaveBeenCalledTimes(1);
    expect(mockSetProviderType).toHaveBeenCalledWith(
      MOCK_MAINNET_CONFIGURATION.type,
    );
  });

  it('should call setProviderType when switching to a built in infura network', async () => {
    const mockSetProviderType = jest.fn();
    const mockSetActiveNetwork = jest.fn();
    const switchEthereumChainHandler = switchEthereumChain.implementation;
    await switchEthereumChainHandler(
      {
        origin: 'example.com',
        params: [{ chainId: CHAIN_IDS.HIZOCO }],
      },
      {},
      jest.fn(),
      jest.fn(),
      {
        getCurrentChainId: () => NON_INFURA_CHAIN_ID,
        findNetworkClientIdByChainId: () => 123,
        setNetworkClientIdForDomain: jest.fn(),
        getProviderConfig: () => ({ chainId: NON_INFURA_CHAIN_ID }),
        findNetworkConfigurationBy: () => MOCK_HIZOCO_CONFIGURATION,
        setProviderType: mockSetProviderType,
        setActiveNetwork: mockSetActiveNetwork,
        requestUserApproval: mockRequestUserApproval,
      },
    );
    expect(mockSetProviderType).toHaveBeenCalledTimes(1);
    expect(mockSetProviderType).toHaveBeenCalledWith(
      MOCK_HIZOCO_CONFIGURATION.type,
    );
  });

    it('should call setActiveNetwork when switching to a built-in infura network, when chainId from request is lower case', async () => {
      const mocks = makeMocks({
        permissionsFeatureFlagIsActive,
        overrides: {
          findNetworkConfigurationBy: jest
            .fn()
            .mockReturnValue(createMockLineaMainnetConfiguration()),
        },
      });
      const switchEthereumChainHandler = switchEthereumChain.implementation;
      await switchEthereumChainHandler(
        {
          origin: 'example.com',
          params: [{ chainId: CHAIN_IDS.LINEA_MAINNET.toLowerCase() }],
        },
        {},
        jest.fn(),
        jest.fn(),
        mocks,
      );
      expect(mocks.setActiveNetwork).toHaveBeenCalledTimes(1);
      expect(mocks.setActiveNetwork).toHaveBeenCalledWith(
        createMockLineaMainnetConfiguration().type,
      );
    });

  it('should call setProviderType when switching to a built in infura network, when chainId from request is upper case', async () => {
    const mockSetProviderType = jest.fn();
    const mockSetActiveNetwork = jest.fn();
    const switchEthereumChainHandler = switchEthereumChain.implementation;
    await switchEthereumChainHandler(
      {
        origin: 'example.com',
        params: [{ chainId: CHAIN_IDS.LINEA_MAINNET.toUpperCase() }],
      },
      {},
      jest.fn(),
      jest.fn(),
      {
        getCurrentChainId: () => NON_INFURA_CHAIN_ID,
        findNetworkClientIdByChainId: () => 123,
        setNetworkClientIdForDomain: jest.fn(),
        getProviderConfig: () => ({ chainId: NON_INFURA_CHAIN_ID }),
        findNetworkConfigurationBy: () => MOCK_LINEA_MAINNET_CONFIGURATION,
        setProviderType: mockSetProviderType,
        setActiveNetwork: mockSetActiveNetwork,
        requestUserApproval: mockRequestUserApproval,
      },
    );
    expect(mockSetProviderType).toHaveBeenCalledTimes(1);
    expect(mockSetProviderType).toHaveBeenCalledWith(
      MOCK_LINEA_MAINNET_CONFIGURATION.type,
    );
  });

  it('should call setActiveNetwork when switching to a custom network', async () => {
    const mockSetProviderType = jest.fn();
    const mockSetActiveNetwork = jest.fn();
    const switchEthereumChainHandler = switchEthereumChain.implementation;
    await switchEthereumChainHandler(
      {
        origin: 'example.com',
        params: [{ chainId: NON_INFURA_CHAIN_ID }],
      },
      {},
      jest.fn(),
      jest.fn(),
      {
        getCurrentChainId: () => CHAIN_IDS.MAINNET,
        findNetworkClientIdByChainId: () => 123,
        setNetworkClientIdForDomain: jest.fn(),
        getProviderConfig: () => ({ chainId: CHAIN_IDS.MAINNET }),
        findNetworkConfigurationBy: () => MOCK_MAINNET_CONFIGURATION,
        setProviderType: mockSetProviderType,
        setActiveNetwork: mockSetActiveNetwork,
        requestUserApproval: mockRequestUserApproval,
      },
    );
    expect(mockSetActiveNetwork).toHaveBeenCalledTimes(1);
    expect(mockSetActiveNetwork).toHaveBeenCalledWith(
      MOCK_MAINNET_CONFIGURATION.id,
    );
  });
  it('should call setActiveNetwork when switching to a custom network', async () => {
    const mockSetProviderType = jest.fn();
    const mockSetActiveNetwork = jest.fn();
    const switchEthereumChainHandler = switchEthereumChain.implementation;
    await switchEthereumChainHandler(
      {
        origin: 'example.com',
        params: [{ chainId: NON_INFURA_CHAIN_ID }],
      },
      {},
      jest.fn(),
      jest.fn(),
      {
        getCurrentChainId: () => CHAIN_IDS.HIZOCO,
        findNetworkClientIdByChainId: () => 123,
        setNetworkClientIdForDomain: jest.fn(),
        getProviderConfig: () => ({ chainId: CHAIN_IDS.HIZOCO }),
        findNetworkConfigurationBy: () => MOCK_HIZOCO_CONFIGURATION,
        setProviderType: mockSetProviderType,
        setActiveNetwork: mockSetActiveNetwork,
        requestUserApproval: mockRequestUserApproval,
      },
    );
    expect(mockSetActiveNetwork).toHaveBeenCalledTimes(1);
    expect(mockSetActiveNetwork).toHaveBeenCalledWith(
      MOCK_HIZOCO_CONFIGURATION.id,
    );
  });
});
