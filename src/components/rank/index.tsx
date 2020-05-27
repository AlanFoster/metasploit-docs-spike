import { Tag, Tooltip } from 'antd';
import React from 'react';

const Ranking = {
  Manual: 0,
  Low: 100,
  Average: 200,
  Normal: 300,
  Good: 400,
  Great: 500,
  Excellent: 600,
};

const getRankDetails = (rank: number) => {
  switch (rank) {
    case Ranking.Manual:
      return {
        title: 'Manual',
        description:
          'The exploit is unstable or difficult to exploit and is basically a DoS. This ranking is also used when the module has no use unless specifically configured by the user',
      };
    case Ranking.Low:
      return {
        title: 'Low',
        description:
          'The exploit is nearly impossible to exploit (or under 50% success rate) for common platforms.\n',
      };
    case Ranking.Average:
      return {
        title: 'Average',
        description:
          'The exploit is generally unreliable or difficult to exploit.\n',
      };
    case Ranking.Normal:
      return {
        title: 'Normal',
        description:
          "The exploit is otherwise reliable, but depends on a specific version and can't (or doesn't) reliably autodetect.\n",
      };
    case Ranking.Good:
      return {
        title: 'Good',
        description:
          'The exploit has a default target and it is the "common case" for this type of software (English, Windows 7 for a desktop app, 2012 for server, etc).\n',
      };
    case Ranking.Great:
      return {
        color: 'green',
        title: 'Great',
        description:
          'The exploit has a default target AND either auto-detects the appropriate target or uses an application-specific return address AFTER a version check.\n',
      };
    case Ranking.Excellent:
      return {
        color: 'green',
        title: 'Excellent',
        description:
          'The exploit will never crash the service. This is the case for SQL Injection, CMD execution, RFI, LFI, etc. No typical memory corruption exploits should be given this ranking unless there are extraordinary circumstances (WMF Escape()).',
      };
  }
};

export const Rank = ({ rank }: any) => {
  const rankDetails = getRankDetails(rank);

  return (
    <Tooltip placement="bottom" title={rankDetails.description}>
      <Tag color={rankDetails.color || 'default'} className="rank">
        {rankDetails.title} Ranking
      </Tag>
    </Tooltip>
  );
};
