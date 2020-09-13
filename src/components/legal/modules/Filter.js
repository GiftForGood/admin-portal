import React, { useState } from 'react';
import { LEGAL_TYPE_CHOICE, LEGAL_TYPE } from '@constants/legal';
import { Popover, Button, ListChoice } from '@kiwicom/orbit-components/';
import { ChevronDown } from '@kiwicom/orbit-components/lib/icons';

const Filter = ({ onSelectedFilter }) => {
  const [currentFilter, setCurrentFilter] = useState(LEGAL_TYPE_CHOICE.PRIVACY_POLICY);

  return (
    <Popover
      content={
        <div>
          {Object.entries(LEGAL_TYPE_CHOICE).map((typeChoice) => (
            <ListChoice
              title={typeChoice[1].toUpperCase()}
              onClick={() => {
                setCurrentFilter(typeChoice[1].toUpperCase());
                onSelectedFilter(LEGAL_TYPE[typeChoice[0]]);
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
