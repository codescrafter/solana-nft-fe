import React, { useState } from 'react';
import { useConnection } from "@solana/wallet-adapter-react";
import { notify } from "../utils/notifications";
import { PublicKey } from '@solana/web3.js';
import * as SPLToken from "@solana/spl-token";

const NFTHoldersTable = () => {
  const { connection } = useConnection();
  const [days, setDays] = useState(0);
  const [holders, setHolders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const collectionMint = new PublicKey('C48NrLKsHLKbfNiRZcUvCqhSRQtRj71BCZXNWK9nRmRn');

  const fetchNFTHolders = async () => {
    try {
      setIsLoading(true);
      
      const nftMints = await connection.getProgramAccounts(
        new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        {
          filters: [
            {
              dataSize: 165,
            },
            {
              memcmp: {
                offset: 0,
                bytes: collectionMint.toString(),
              },
            },
          ],
        }
      );

      const currentSlot = await connection.getSlot();
      const currentBlockTime = await connection.getBlockTime(currentSlot);
      const holdersMap = new Map();

      for (const nft of nftMints) {
        try {
          const tokenAccountInfo = SPLToken.AccountLayout.decode(nft.account.data);
          const ownerAddress = new PublicKey(tokenAccountInfo.owner).toString();
          
          const signatures = await connection.getSignaturesForAddress(nft.pubkey, { limit: 1 });
          
          if (signatures && signatures.length > 0) {
            const firstTx = signatures[signatures.length - 1];
            const holdingTime = (currentBlockTime - firstTx.blockTime) / (24 * 60 * 60);
            
            if (holdingTime >= days) {
              if (holdersMap.has(ownerAddress)) {
                const holderInfo = holdersMap.get(ownerAddress);
                holdersMap.set(ownerAddress, {
                  ...holderInfo,
                  nftCount: holderInfo.nftCount + 1
                });
              } else {
                holdersMap.set(ownerAddress, {
                  address: ownerAddress,
                  holdingDays: holdingTime,
                  nftCount: 1
                });
              }
            }
          }
        } catch (error) {
          console.error('Error processing NFT:', error);
        }
      }

      setHolders(Array.from(holdersMap.values()));
    } catch (error) {
      console.error('Error fetching NFT holders:', error);
      notify({
        type: 'error',
        message: 'Failed to fetch NFT holders',
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHolder = (addressToDelete) => {
    setHolders(holders.filter(holder => holder.address !== addressToDelete));
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-gray-900 rounded-lg shadow-xl border border-gray-800">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white">NFT Holders</h2>
        <p className="text-sm text-gray-400 mt-1">Collection: {collectionMint.toString()}</p>
      </div>
      
      <div className="p-6">
        <div className="flex items-end gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Minimum Holding Period (days)
            </label>
            <input
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-48 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md 
                       text-white focus:outline-none focus:ring-2 focus:ring-purple-500 
                       focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchNFTHolders}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
          >
            {isLoading ? 'Searching...' : 'Search Holders'}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-300">Loading holders data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 border-b border-gray-700">
                  <th className="px-4 py-3 text-left font-medium text-gray-300">Wallet Address</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-300">Holding Period (days)</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-300">NFTs Owned</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {holders.map((holder, index) => (
                  <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm text-purple-400">
                      {holder.address}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {holder.holdingDays.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {holder.nftCount}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteHolder(holder.address)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
                {holders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No holders found for the selected holding period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTHoldersTable;