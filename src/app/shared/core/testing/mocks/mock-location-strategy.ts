/**
 * Mock location strategy (until provided by @angular)
 * Copied from https://github.com/angular/angular/blob/master/
 * modules/%40angular/common/testing/mock_location_strategy.ts
 */
import { LocationStrategy } from '@angular/common';
import { Injectable, EventEmitter } from '@angular/core';

/**
 * A mock implementation of {@link LocationStrategy} that allows tests to fire simulated
 * location events.
 *
 * @stable
 */
@Injectable()
export class MockLocationStrategy extends LocationStrategy {
  public internalBaseHref: string = '/';
  public internalPath: string = '/';
  public internalTitle: string = '';
  public urlChanges: string[] = [];
  /** @internal */
   private _subject: EventEmitter<any> = new EventEmitter();
  constructor() { super(); }

  public simulatePopState(url: string): void {
    this.internalPath = url;
    this._subject.emit(new MockPopStateEvent(this.path()));
  }

  public path(includeHash: boolean = false): string { return this.internalPath; }

  public prepareExternalUrl(internal: string): string {
    if ((<any> internal).startsWith('/') && (<any> this.internalBaseHref).endsWith('/')) {
      return this.internalBaseHref + internal.substring(1);
    }
    return this.internalBaseHref + internal;
  }

  public pushState(ctx: any, title: string, path: string, query: string): void {
    this.internalTitle = title;

    let url = path + (query.length > 0 ? ('?' + query) : '');
    this.internalPath = url;

    let externalUrl = this.prepareExternalUrl(url);
    this.urlChanges.push(externalUrl);
  }

  public replaceState(ctx: any, title: string, path: string, query: string): void {
    this.internalTitle = title;

    let url = path + (query.length > 0 ? ('?' + query) : '');
    this.internalPath = url;

    let externalUrl = this.prepareExternalUrl(url);
    this.urlChanges.push('replace: ' + externalUrl);
  }

  public onPopState(fn: (value: any) => void): void { this._subject.subscribe({next: fn}); }

  public getBaseHref(): string { return this.internalBaseHref; }

  public back(): void {
    if (this.urlChanges.length > 0) {
      this.urlChanges.pop();
      let nextUrl = this.urlChanges.length > 0 ? this.urlChanges[this.urlChanges.length - 1] : '';
      this.simulatePopState(nextUrl);
    }
  }

  public forward(): void { throw 'not implemented'; }
}

class MockPopStateEvent {
  public pop: boolean = true;
  public type: string = 'popstate';
  constructor(public newUrl: string) {}
}
