import React, { useState } from 'react';
import { SECTOR_FILTER_TYPE } from '../../../../utils/constants/npoOrganization';
import { Popover, Button, ListChoice } from '@kiwicom/orbit-components/';
import { ChevronDown } from '@kiwicom/orbit-components/lib/icons';

const Filter = ({ onSelectedFilter }) => {
  const [currentFilter, setCurrentFilter] = useState(SECTOR_FILTER_TYPE.ALL);

  return (
    <Popover
      content={
        <div>
          {Object.values(SECTOR_FILTER_TYPE).map((sector) => (
            <ListChoice
              key={sector}
              title={sector.toUpperCase()}
              onClick={() => {
                setCurrentFilter(sector.toUpperCase());
                onSelectedFilter(sector);
              }}
            />
          ))}
        </div>
      }
      noPadding
      preferredPosition="bottom"
    >
      <Button size="normal" iconRight={<ChevronDown />}>
        {currentFilter.toUpperCase()}
      </Button>
    </Popover>
  );
};

export default Filter;
