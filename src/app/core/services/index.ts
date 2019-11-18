import { ConfigService } from './config.service';
import { ModalService } from './modal.service';
import { LoaderService } from './loader.service';
import { GoogleTagManagerService } from './google-tag-manager.service';

export { ConfigService, ModalService, LoaderService, GoogleTagManagerService };

export const CORE_SERVICES = [
  ConfigService, ModalService, LoaderService, GoogleTagManagerService
];
