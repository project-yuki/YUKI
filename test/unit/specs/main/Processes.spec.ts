// tslint:disable-next-line: no-reference
/// <reference path="../../../../src/types/common.d.ts" />

import { expect } from 'chai'
import * as _ from 'lodash'
import Processes from '../../../../src/main/Processes'

describe('Processes', () => {
  it('returns processes that include explorer.exe', (done) => {
    Processes.get().then((result) => {
      try {
        // tslint:disable-next-line: no-unused-expression
        expect(_.some(result, { name: 'explorer.exe' })).to.be.true
      } catch (e) {
        return done(e)
      }
      done()
    }).catch(() => {
      done(new Error('rejected'))
    })
  })
})
