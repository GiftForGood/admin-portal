import React, { useState } from 'react';
import { DONOR_TYPES } from '@constants/donor';
import { Popover, Button, ListChoice } from '@kiwicom/orbit-components/';
import { ChevronDown } from '@kiwicom/orbit-components/lib/icons';

const DonorFilters = ({ onSelectedFilter }) => {
  const [currentFilter, setCurrentFilter] = useState(DONOR_TYPES.ALL);

  return (
    <Popover
      content={
        <div>
          {Object.values(DONOR_TYPES).map((status) => (
            <ListChoice
              key={status}
              title={status.toUpperCase()}
              onClick={() => {
                setCurrentFilter(status.toUpperCase());
                onSelectedFilter(status);
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

export default DonorFilters;
