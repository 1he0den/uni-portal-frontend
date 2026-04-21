import { TestBed } from '@angular/core/testing';

import { UserModelTs } from './user.model.ts';

describe('UserModelTs', () => {
  let service: UserModelTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserModelTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
