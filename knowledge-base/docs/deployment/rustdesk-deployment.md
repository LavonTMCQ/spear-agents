# RustDesk Pro Server Deployment Guide

## Overview

This guide documents the successful deployment of RustDesk Pro server for SPEAR's remote access infrastructure.

## ✅ Production Deployment Status

**Date**: June 5, 2025  
**Status**: ✅ PRODUCTION READY  
**Result**: RustDesk Pro server successfully deployed and operational

## Server Information

### Production Server Details

- **IP Address**: `157.230.227.24` _(Updated: 2025-11-19)_
- **Web Console**: http://157.230.227.24:21114
- **Status**: ✅ Online and Running
- **License**: `+iOXAUS4gnKPPzWl6YUqGQ==` (Active)
- **Server Key**: `RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=` _(Updated: 2025-11-19)_

**Previous Server (Expired)**:
- IP: `146.190.72.172`
- Server Key: `61PhlnkYifqNNk1NgHvgKeCfrsILb8TULTiRtk8ZXho=`

### Service Ports

- **Web Console**: 21114 (HTTP)
- **ID Server**: 21116 (TCP/UDP)
- **Relay Server**: 21117 (TCP)
- **API Port**: 21114 (HTTP)

### DigitalOcean Infrastructure

- **Droplet Name**: spear-rustdesk-pro
- **Size**: 2 vCPU, 2GB RAM, 60GB SSD
- **Region**: NYC1
- **OS**: Ubuntu 22.04 LTS
- **Monthly Cost**: $12/month

## Configuration

### Environment Variables for SPEAR Application

**Production Environment (Updated 2025-11-19):**
```bash
# RustDesk Production Server Configuration
RUSTDESK_SERVER_IP=157.230.227.24
RUSTDESK_SERVER_PORT=21116
RUSTDESK_RELAY_PORT=21117
RUSTDESK_API_PORT=21114
RUSTDESK_SERVER_KEY=RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=
RUSTDESK_API_TOKEN=spear-admin-token-2024

# Public environment variables (for client-side)
NEXT_PUBLIC_RUSTDESK_SERVER_IP=157.230.227.24
NEXT_PUBLIC_RUSTDESK_SERVER_PORT=21116
NEXT_PUBLIC_RUSTDESK_RELAY_PORT=21117
NEXT_PUBLIC_RUSTDESK_API_PORT=21114
NEXT_PUBLIC_RUSTDESK_SERVER_KEY=RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=
```

### Web Console Access

- **URL**: http://157.230.227.24:21114
- **Username**: admin
- **Password**: ✅ Changed from default (secure)
- **Features**: Full Pro license features available

### Available Features

- ✅ User management
- ✅ Device management  
- ✅ Access control
- ✅ Connection logs
- ✅ Pro license features
- ✅ API access

## Client Device Configuration

### Samsung A14 Configuration (Updated 2025-11-19)

```
ID Server: 157.230.227.24:21116
Relay Server: 157.230.227.24:21117
Key: RweaRIQPdyQZxwRiCJ6BgZoNnFXPd5VfSvakliQ3heQ=
```

### Configuration Steps

1. Open RustDesk app on Samsung A14
2. Go to Settings → Network
3. Enter server details above
4. Apply settings
5. Test connection

## Server Management

### SSH Access

```bash
ssh root@157.230.227.24
```

### Management Commands

```bash
# Check server status
ssh root@157.230.227.24 'spear-rustdesk-status'

# View RustDesk logs
ssh root@157.230.227.24 'docker logs hbbs'
ssh root@157.230.227.24 'docker logs hbbr'

# Restart RustDesk services
ssh root@157.230.227.24 'cd /opt/rustdesk && docker-compose restart'

# Check Docker containers
ssh root@157.230.227.24 'docker ps'
```

### Service Status Verification

```bash
# Check if services are running
ssh root@157.230.227.24 'docker ps'

# Expected output:
# hbbs (ID Server) - Running
# hbbr (Relay Server) - Running
```

## Integration with SPEAR Application

### Admin Interface Integration

- ✅ RustDesk Console tab added to admin navigation
- ✅ User management interface implemented
- ✅ Device monitoring dashboard ready
- ✅ Subscription-based access control system ready

### API Endpoints

- `/api/rustdesk/status` - Server health monitoring
- `/api/rustdesk/users/[userId]` - User management
- `/api/webhooks/subscription` - Automatic access control

## Cost Analysis

### Monthly Costs

- **DigitalOcean VPS**: $12.00/month
- **RustDesk Pro License**: Included (already owned)
- **SSL Certificate**: Free (Let's Encrypt - when domain added)
- **Total Monthly Cost**: $12.00/month

### One-time Costs

- **Setup**: $0 (automated deployment)
- **Domain** (optional): $10-15/year

## Business Model Integration

### Subscription-Based Access Control

RustDesk Pro provides the infrastructure for SPEAR's business model protection:

1. **Device Provisioning**: Admin assigns devices to paying customers
2. **Access Control**: Subscription status controls device access
3. **User Management**: Pro console manages customer accounts
4. **Monitoring**: Connection logs track usage and access

### Device Access Workflow

```
Customer Payment → Subscription Active → Device Access Granted
Payment Failed → Grace Period → Device Access Revoked
Admin Intervention → Manual Access Control
```

## Security Features

### Network Security

- **Firewall**: Configured for ports 21114-21119
- **Nginx**: Reverse proxy configured
- **Encryption**: Private encryption keys
- **Access Control**: Admin-only console access

### Business Protection

- **User Disable**: Can disable individual users
- **Device Control**: Can revoke device access
- **Connection Monitoring**: Track all connections
- **API Integration**: Automated access control

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check server status: `docker ps | grep rustdesk`
   - Verify firewall ports are open
   - Test network connectivity

2. **Web Console Inaccessible**
   - Check nginx status: `systemctl status nginx`
   - Verify port 21114 is accessible
   - Check admin credentials

3. **Device Configuration Issues**
   - Verify server IP and ports
   - Check server key is correct
   - Test with RustDesk client directly

### Health Checks

```bash
# Server health check
curl http://157.230.227.24:21114/api/health

# Service status
systemctl status spear-rustdesk

# Docker container status
docker ps --filter name=rustdesk
```

## Future Enhancements

### Planned Features

1. **Custom Domain**: Add HTTPS with custom domain
2. **Automated Backups**: Set up configuration backups
3. **Monitoring Alerts**: Configure uptime monitoring
4. **Load Balancing**: Scale for higher capacity

### Integration Roadmap

1. **SPEAR Web Client**: Direct browser-based access
2. **Mobile App Integration**: Native mobile remote access
3. **API Expansion**: Enhanced device management APIs
4. **Analytics**: Connection usage analytics

---

**Success Summary**: Production RustDesk Pro server successfully deployed with full Pro license features, dedicated infrastructure, and complete integration with SPEAR's subscription-based business model. Ready for production use with 100+ concurrent connection capacity.
